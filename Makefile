IP_ADDRESS := $(shell ip -4 route get 8.8.8.8 | grep -oP '(?<=src\s)\d+\.\d+\.\d+\.\d+')
ENV_FILE := .env

.PHONY: build run_container

build:
	@echo "Building API Gateway..."
	@echo "IP Address: $(IP_ADDRESS)"
	@echo "Environment file: $(ENV_FILE)"
	rm -rf $(ENV_FILE)
	cp .env.example $(ENV_FILE)
	cp docker-compose.development.yml docker-compose.yml
	sed -i "s/IP_ADDRESS/$(IP_ADDRESS)/g" $(ENV_FILE)
	docker-compose build
	docker-compose up -d
	rm -rf node_modules
	docker-compose exec -w /opt/node_app/app node npm install
	docker-compose exec -w /opt/node_app/app node npm run docker-migrate:up
  docker-compose exec -w /opt/node_app/app node npm run docker-seed:all

run_container:
	docker-compose up -d
