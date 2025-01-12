#!/bin/bash

function usage() {
	name=$(basename $0)
    echo "usage: $name {tas} {start|stop|forcestop|status}"
    echo "       $name nqh-airtable {start|stop|forcestop|status}"
    echo "       $name nqh-local {start|stop|forcestop|status}"
	exit 0
}


task=$1
shift

action=$1
shift

mkdir -p /tmp/
pidfile=/tmp/${task}-process.pid


case $action in
	status)
	case $task in
		nqh-airtable)
            if [ -f $pidfile ]
            then
                pid=$(cat $pidfile)
                echo "pid file $pidfile found"
                kill -0 $pid 2> /dev/null
                if [ $? = 0 ]
                then
                    echo "running with pid $pid"
                    ps aux | grep node-query-handler-airtable/index.js
                    echo
                    exit 0
                fi
            else
                echo "pid file $pidfile NOT found"
            fi
            echo "not running"
            exit 1
		;;
		nqh-local)
            if [ -f $pidfile ]
            then
                pid=$(cat $pidfile)
                echo "pid file $pidfile found"
                kill -0 $pid 2> /dev/null
                if [ $? = 0 ]
                then
                    echo "running with pid $pid"
                    ps aux | grep node-query-handler/index.js
                    echo
                    exit 0
                fi
            else
                echo "pid file $pidfile NOT found"
            fi
            echo "not running"
            exit 1
		;;
		*) echo "Task \"$task\" is not supported" ; exit 1
	esac
	;;

	start)
	case $task in
		nqh-airtable)
		( node /home/pi/workspace/raspberry5-433mhz-rpi-lgpio/node-query-handler-airtable/index.js  & echo $! >&3 ) > /tmp/lastoutairtable 2>&1 3> $pidfile &
		exit 0
		;;
		nqh-local)
		( node /home/pi/workspace/raspberry5-433mhz-rpi-lgpio/node-query-handler/index.js  & echo $! >&3 ) > /tmp/lastout 2>&1 3> $pidfile &
		exit 0
		;;
		*) echo "Task \"$task\" is not supported" ; exit 1
	esac
	;;

	stop)
	case $task in
		nqh-airtable)
		kill $(cat $pidfile) 2> /dev/null
        echo "" > $pidfile
		exit 0
		;;
		nqh-local)
		kill $(cat $pidfile) 2> /dev/null
        echo "" > $pidfile
		exit 0
		;;
		*) echo "Task \"$task\" is not supported" ; exit 1
	esac
	;;

	forcestop)
	case $task in
		nqh-airtable)
		echo "Stop $task through pkill"
        pkill -f "node-query-handler-airtable/index.js" 2> /dev/null
        echo "" > $pidfile
		exit 0
		;;
		nqh-local)
		echo "Stop $task through pkill"
        pkill -f "node-query-handler/index.js" 2> /dev/null
        echo "" > $pidfile
		exit 0
		;;
		*) echo "Task \"$task\" is not supported" ; exit 1
	esac
	;;

	*)  usage ;;
 esac
 exit 1
