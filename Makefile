.PHONY: logs # ignore existing files and directories

build:
	docker-compose -f docker-compose.yml run

up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up  -d
up-prod:
	docker-compose -f docker-compose.yml up -d 
down:
	docker-compose down --remove-orphans

logs:
	docker-compose logs -f main

install: down build up