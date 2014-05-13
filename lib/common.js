module.exports = {
  
  quiet: function(schema){
    var quiet = [];
    
    schema.eachPath(function(path){
      if(schema.pathType(path) == 'real' && schema.path(path).options.quiet){
        quiet.push(path);
      }
    });
    
    schema.pre('save', function(next, done){
      var dirty = this._dirty().some(function(dirty){
        return (quiet.indexOf(dirty.path) == -1) ? true : false;
      });
      return (!dirty) ? done() : next();
    });
  
  },

  toLower: function(v) {
    return v.toLowerCase();
  },

  timestamps: function() {
    var properties = [].slice.call(arguments);
    
    return function(schema) {
      var o = {
          created: {type: Date, es_type: 'date'}
        , updated: {type: Date, es_type: 'date'}
        , deleted: {type: Date, es_type: 'date'}
      };
      
      properties.forEach(function(prop) {
        o[prop] = { type: Date, default: null };
      });
      
      schema.add({
        date: o
      });

      schema.pre('save', function(next) {
        if (!this.date.created) {
          this.date.created = this.date.updated = new Date;
        } else {
          this.date.updated = new Date;
        }
        next();
      });
    }
    
  },

  slug: function(v, options) {
    options = options || {};
    options.maxLength = options.maxLength || 50;

    var accents = "\u00e0\u00e1\u00e4\u00e2\u00e8"
        + "\u00e9\u00eb\u00ea\u00ec\u00ed\u00ef"
        + "\u00ee\u00f2\u00f3\u00f6\u00f4\u00f9"
        + "\u00fa\u00fc\u00fb\u00f1\u00e7";

    var without = "aaaaeeeeiiiioooouuuunc";

    var map = {'@': '', '\u20ac': ' euro ', 
      '$': ' dollar ', '\u00a5': ' yen ',
      '\u0026': ' and ', '\u00e6': 'ae', '\u0153': 'oe'};

    return v
      // Handle uppercase characters
      .toLowerCase()

      // Handle accentuated characters
      .replace(
        new RegExp('[' + accents + ']', 'g'),
        function (c) { return without.charAt(accents.indexOf(c)); })

      // Handle special characters
      .replace(
        new RegExp('[' + Object.keys(map).join('') + ']', 'g'),
        function (c) { return map[c]; })

      // Dash special characters
      .replace(/[^a-z0-9]/g, '-')

      // Compress multiple dash
      .replace(/-+/g, '-')

      // Limit length
      .substr(0, options.maxLength)

      // Trim dashes
      .replace(/^-|-$/g, '');
      
  }
};
