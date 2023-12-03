# brew install fswatch
# Use tab space only
PID				=	/tmp/tabular_data.pid
GO_FILES	=	$(wildcard *.go */**/*.go)
APP				=	./tabular_data

serve: restart
	@fswatch -o ./* ./**/* | xargs -n1 -I{}  make restart || make kill

kill:
	@echo "killing server with pid: " `cat $(PID)`
	@kill `cat $(PID)` || true

before:
	@echo "Starting server..."

$(APP): $(GO_FILES)
	@echo "Building server..."
	rm -f tabular_data~
	@go build -o ./ ./...

restart: kill before $(APP)
	$(APP) & echo $$! > $(PID)

.PHONY: serve restart kill before
