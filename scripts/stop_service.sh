cd /srv/storyflow-creator
echo this went over to the server

forever stopall

numNodeProcesses=$(pkill -c node)
if [ $numNodeProcesses -ge 1 ]; then
    pkill node
fi

exit 0
