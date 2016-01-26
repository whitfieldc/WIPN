IMAGE_NAME ?= wipn

build:
	@docker build -t $(IMAGE_NAME) .
.PHONY: build

shell:
	@docker run --rm -it \
              -v $(PWD):/wipn \
              --link rethink_wipn:db \
              $(IMAGE_NAME) bash
.PHONY: shell

test:
	@docker run --rm -it \
              -v $(PWD):/wipn \
              $(IMAGE_NAME) mix test
.PHONY: test

app:
	@docker run -d -it \
              -v $(PWD):/wipn \
              -p 3000:3000 \
              --link rethink_wipn:db \
              --name wipn_app \
              $(IMAGE_NAME)
.PHONY: app

db:
	@docker run -d \
              -p 8080:8080 \
              --name rethink_wipn \
              rethinkdb:2.2
.PHONY: db

install: db app
.PHONY: install

clean:
	@docker rm -vf wipn_app rethink_wipn
.PHONY: clean