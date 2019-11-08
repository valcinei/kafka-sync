const path = require("path");
const chokidar = require("chokidar");
const { promisify } = require("util");
const { readFile } = require("fs");
const pReadFile = promisify(readFile);

const { Producer, KafkaClient } = require("kafka-node");

const FOLDER_PRODUCER_SOURCE =
    process.env.FOLDER_PRODUCER_SOURCE || "./source/";

    const KAFKA_HOST = process.env.KAFKA_HOST || "localhost:9092";

const getFileName = path => {
    const splitedPath = path.split("/");
    return splitedPath[splitedPath.length - 1];
};

module.exports = {
    sendData(payloadData) {
        const client = new KafkaClient({ kafkaHost: KAFKA_HOST });
        const producer = new Producer(client);
        const parsedData = JSON.stringify(payloadData);
        const payloads = [
            { topic: "updateFile", messages: parsedData, partition: 0 }
        ];
        producer.on("ready", () => {
            producer.send(payloads, (err, data) => {
                console.log("Send data", data);
            });
        });

        producer.on("error", err => {
            console.log("Error ro send file", err);
        });
    },

    startProducer() {
        chokidar
            .watch(path.resolve(FOLDER_PRODUCER_SOURCE), {
                ignored: /(^|[\/\\])\../
            })
            .on("all", async (eventType, path, stats) => {
                try {
                    const hexFile = await pReadFile(path, { encoding: "hex" });
                    const fileName = getFileName(path);
                    this.sendData({
                        path: path,
                        content: hexFile,
                        fileName: fileName,
                        event: eventType
                    });
                } catch (error) {
                    throw new Error("Error to read File");
                }
            });
    }
};
module.exports.startProducer();
