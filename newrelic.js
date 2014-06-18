/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['wcbrazil'],
  /**
   * Your New Relic license key.
   */
  license_key : 'b26ae7f22d629372209b48f2a2b0e8dfbf76dca0',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : 'warn'
  },
  // other configuration
  rules : {
    ignore : [
      '^/socket.io/.*/xhr-polling',
      '^/socket.io/.*/jsonp-polling',
      '^/socket.io/.*/htmlfile'
    ]
  }
};
