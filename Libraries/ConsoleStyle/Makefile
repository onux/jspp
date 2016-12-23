clean:
	rm app.jspp.js

test:
	js++ src/ test/ ../jsppUnit/src/ && node app.jspp.js
	$(MAKE) clean

preview:
	js++ src/ preview.jspp && node app.jspp.js
	$(MAKE) clean

.PHONY:test
.SILENT:clean