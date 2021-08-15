const TOKEN_SECRET = "P3RN1PR!V7T3K3Y";
const SEND_SMS_URL =
  "http://185.37.53.162:8080/Messages/SendViaURL?Username=pernymarket&password=222&SenderId=10001333310161&";

const MONGOOSE_USR = "pernyAdmin";
const MONGOOSE_PWD = "P3rn!AdM4n";
const MONGOOSE_PORT = "27017";
const MONGOOSE_IP = "185.94.98.209";
const MONGOOSE_DATABASE_NAME = "PernyDb";
const MONGOOSE_CONNECTION_URL = `mongodb://${MONGOOSE_USR}:${MONGOOSE_PWD}@${MONGOOSE_IP}:${MONGOOSE_PORT}/${MONGOOSE_DATABASE_NAME}`;
const MONGOOSE_CONFIG = {
  useNewUrlParser: true,
  authSource: MONGOOSE_DATABASE_NAME,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
const BASE_URL = "https://pernymarket.ir/";
const SLIDER_SIZE = { width: 1580, height: 425 };
const DEFAULT_SIZE = { width: 400, height: 400 };

const PAYMENT_GATEWAY_TERMINAL_ID = "5090353";
const PAYMENT_GATEWAY_USERNAME = "Drclubs1398";
const PAYMENT_GATEWAY_PASSWORD = "97769635";

module.exports = {
  TOKEN_SECRET,
  BASE_URL,
  SEND_SMS_URL,
  MONGOOSE_CONNECTION_URL,
  MONGOOSE_CONFIG,
  SLIDER_SIZE,
  DEFAULT_SIZE,
  PAYMENT_GATEWAY_TERMINAL_ID,
  PAYMENT_GATEWAY_USERNAME,
  PAYMENT_GATEWAY_PASSWORD,
};
