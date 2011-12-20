IN := lib/jspp/lang/es5.js src/jsdefs.js src/jsparse.js src/typed-es3.js src/compiler.js typesys/strict.js
OUT := jspp.js

all: $(OUT)

$(OUT): $(IN)
	cat $^ > $@

clean:
	rm $(OUT) -rf
