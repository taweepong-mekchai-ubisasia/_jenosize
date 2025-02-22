export default class Query {
  call;
  method;
  vm = null;
  url = null;
  body = null;
  callback = null;
  constructor(call, method) {
    this.call = call;
    this.method = method;
  }

  get(vm = null, url = null, callback = null) {
    this.vm = vm;
    this.url = url;
    this.callback = callback;
    return this.fetch();
  }

  set(vm = null, url = null, body = null, callback = null) {
    this.vm = vm;
    this.url = url;
    this.body = body;
    this.callback = callback;
    return this.fetch();
  }

  _body() {
    return {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.vm.user_token}`,
      },
      body: JSON.stringify(this.body),
    };
  }

  _nobody() {
    return {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.vm.user_token}`,
      },
    };
  }

  async fetch() {
    let _vm = this;
    try {
      const resp = await fetch(
        _vm.url,
        _vm.method.toLowerCase() == "get" ? _vm._nobody() : _vm._body()
      );
      // console.log(resp);
      let total = resp.headers.get("content-length");
      let reader = await resp.body.getReader();
      const decoder = new TextDecoder();
      var bytesReceived = 0;
      const chunks = [];
      let res = await reader.read().then(function processResult(result) {
        if (result.done) {
          try {
            return JSON.parse(chunks.join(""));
          } catch (error) {
            console.log(error);
            return {
              success: false,
              errorMsg: "Invalid Response Format Error.",
            };
          }
        }
        bytesReceived += result.value.length;
        console.log(`Received ${bytesReceived} bytes of data so far`);
        const chunk = decoder.decode(result.value, { stream: true });
        chunks.push(chunk);

        _vm.call
          ? (_vm.vm[_vm.call].loading_percent =
              (parseFloat(bytesReceived) / parseFloat(total)) * 100)
          : "";
        return reader.read().then(processResult);
      });
      return _vm.callback ? _vm.callback({ ...res }) : "";
    } catch (err) {
      console.log(err);
      return _vm.callback
        ? _vm.callback({
            success: false,
            errorMsg: err,
          })
        : "";
    }
  }
}
