import { CronJob } from 'cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

const CLIENT_ID = '95008c5b-db0f-442f-99c0-4dc06562a91a'
const MODULE_ID = 3
const SENSOR_ID = 2

const randomInInterval = (min: number, max: number, fix = 2): string =>
  (Math.random() * (max - min) + min).toFixed(fix)

const updateData = (client: MqttClient) => {
  return new CronJob('*/15 * * * * *', async (): Promise<void> => {
    const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    client.on('error', error => {
      pubDebug('Error: ', error)
    })

    client.publish(
      `${MAIN_TOPIC}/pH`,
      `${CLIENT_ID}/${MODULE_ID}/${SENSOR_ID}/${randomInInterval(6.5, 7.5, 1)}`,
      () => {
        client.publish(
          `${MAIN_TOPIC}/tds`,
          `${CLIENT_ID}/${MODULE_ID}/${SENSOR_ID}/${randomInInterval(
            100,
            200,
            0
          )}`,
          () => {
            client.publish(
              `${MAIN_TOPIC}/temperature`,
              `${CLIENT_ID}/${MODULE_ID}/${SENSOR_ID}/${randomInInterval(
                22,
                25,
                1
              )}`,
              () => {
                client.publish(
                  `${MAIN_TOPIC}/turbidity`,
                  `${CLIENT_ID}/${MODULE_ID}/${SENSOR_ID}/${randomInInterval(
                    10,
                    30,
                    0
                  )}`
                )
              }
            )
          }
        )
      }
    )
  })
}

export { updateData }
