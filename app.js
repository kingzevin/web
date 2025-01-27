/* eslint-disable
    max-len,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const metrics = require('metrics-sharelatex')
metrics.initialize(process.env['METRICS_APP_NAME'] || 'web')
const Settings = require('settings-sharelatex')
const logger = require('logger-sharelatex')
logger.initialize(process.env['METRICS_APP_NAME'] || 'web')
logger.logger.serializers.user = require('./app/src/infrastructure/LoggerSerializers').user
logger.logger.serializers.docs = require('./app/src/infrastructure/LoggerSerializers').docs
logger.logger.serializers.files = require('./app/src/infrastructure/LoggerSerializers').files
logger.logger.serializers.project = require('./app/src/infrastructure/LoggerSerializers').project
if ((Settings.sentry != null ? Settings.sentry.dsn : undefined) != null) {
  logger.initializeErrorReporting(Settings.sentry.dsn)
}

metrics.memory.monitor(logger)
const Server = require('./app/src/infrastructure/Server')

if (Settings.catchErrors) {
  process.removeAllListeners('uncaughtException')
  process.on('uncaughtException', error =>
    logger.error({ err: error }, 'uncaughtException')
  )
}
const port = Settings.port || Settings.internal.web.port || 3000
const host = Settings.internal.web.host || 'localhost'
if (!module.parent) {
  // Called directly
  Server.server.listen(port, host, function() {
    logger.info(`web starting up, listening on ${host}:${port}`)
    logger.info(`${require('http').globalAgent.maxSockets} sockets enabled`)
    // wait until the process is ready before monitoring the event loop
    metrics.event_loop.monitor(logger)
  })
}

module.exports = Server.server
