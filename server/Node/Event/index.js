const EventEmitter = require("./event");
// const EventEmitter = require("events");

const e = new EventEmitter();

const handler1 = () => {
  console.log("handkler1");
  // console.log("trigger myEvent1");
};

e.on("myEvent", handler1);

e.on("newListener", (type) => {
  console.log(1);
  process.nextTick(() => {
    console.log("2");
    e.emit(type);
  });
});

e.on("myEvent", handler1);

// e.on("myEvent1", handler1);
// e.on("myEvent", handler1); // 后面的2个 * 锕一共的数量 = 6
// e.on("myEvent", handler1); // 后面的3个 * 4一共的数量 = 12
