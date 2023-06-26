until mongo --host mongo --eval "print(\"waited for connection\")"

do
    sleep 1
done
mongo --host mongo --eval "rs.initiate({_id:\"dbrs\", members:[ {_id:0, host:\"database\", priority:1},{_id:1, host:\"database-replica1\", priority:0.5},{_id:2, host:\"database-replica2\", priority:0.5}]})"
