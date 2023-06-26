FROM mongo:6

# we take over the default & start mongo in replica set mode in a background task
ENTRYPOINT \
INIT_REPL_CMD="rs.initiate({ _id: 'dbrs', members: [{_id: 0, host:'database', priority:1},{_id:1, host:'database-replica1', priority:0.5},{_id:2, host:'database-replica2', priority:0.5}] })"; \
until (mongosh database --eval "$INIT_REPL_CMD "); do sleep 1; done; \
echo "REPLICA SET ONLINE"; 

