const path = require("path");
const { promisify } = require("util");
const { writeFile } = require("fs");
const pwriteFile = promisify(writeFile);

const { Consumer, KafkaClient } = require("kafka-node");

const FOLDER_CONSUMER_DESTINATION =
    process.env.FOLDER_CONSUMER_DESTINATION || "./dest";

    const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9092";

async function saveFile(payload) {
    const file = path.resolve(
        `${FOLDER_CONSUMER_DESTINATION}/${payload.fileName}`
    );
    const buf = Buffer.from(payload.content, "hex");
    await pwriteFile(file, buf, "binary");
}

function startConsumer() {
    console.log("start consumer");
    let client = new KafkaClient({
        kafkaHost: KAFKA_HOST
    });
    consumer = new Consumer(client, [{ topic: "updateFile", partition: 0 }], {
        autoCommit: false,
        fromOffset: "none"
    });

    consumer.on("message", async msg => {
        const payload = JSON.parse(msg.value);
        if (payload.content) {
            saveFile(payload);
        } else {
            console.log("File Content Null", payload);
        }
    });
}

module.exports = {
    startConsumer
};
module.exports.startConsumer();
