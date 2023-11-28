all: pull restart

pull:
	git pull
	npm install

stop:
	-pkill -f ryan-gosling-bot 2> /dev/null

start:
	bash -c "exec -a ryan-gosling-bot node index.js > debug.log 2>&1 &"

restart: stop start
