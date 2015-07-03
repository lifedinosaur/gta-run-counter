module.exports = function(grunt) {
  "use strict";

  // underscore:
  var _ = grunt.util._;

  // load tasks:
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);


  // amdify:
  var amdBsTransition = {
    src: '<%= config.paths.dest.bootstrap %>',
    deps: ['jquery=$', 'bootstrap/transition']
  };

  var amdifyFiles = [
    // bootstrap:
    _.extend({}, amdBsTransition, { name: 'affix'}),
    _.extend({}, amdBsTransition, { name: 'alert'}),
    _.extend({}, amdBsTransition, { name: 'button'}),
    _.extend({}, amdBsTransition, { name: 'carousel'}),
    _.extend({}, amdBsTransition, { name: 'collapse'}),
    _.extend({}, amdBsTransition, { name: 'dropdown'}),
    _.extend({}, amdBsTransition, { name: 'modal'}),
    _.extend({}, amdBsTransition, { name: 'popover'}),
    _.extend({}, amdBsTransition, { name: 'scrollspy'}),
    _.extend({}, amdBsTransition, { name: 'tab'}),
    _.extend({}, amdBsTransition, { name: 'tooltip'}),
    {
      name: 'transition',
      src: '<%= config.paths.dest.bootstrap %>',
      deps: ['jquery=$']
    }
  ];


  // main config:
  grunt.initConfig({
    config: grunt.file.readJSON('grunt-config.json', { encoding: 'utf8'}),

    pkgJson: grunt.file.readJSON('package.json', { encoding: 'utf8'}),


    // tasks init:

    autoprefixer: {
      options: {
        browsers: '<%= config.autoprefixerBrowsers %>'
      },
      compile: {
        src: '<%= config.paths.dest.css %>' + 'custom.min.css'
      }
    },

    clean: {
      bootstrap: [
        '<%= config.paths.dest.bootstrap %>',
        '<%= config.paths.dest.fonts %>' + 'glyphicons-*'
      ],
      build: '<%= config.paths.dest.dist %>',
      css: '<%= config.paths.dest.css %>',
      fonts: '<%= config.paths.dest.fonts %>',
      lib: '<%= config.paths.dest.lib %>',
      pkg: '<%= config.paths.pkg %>',
      prod: [
        '<%= config.paths.dest.js %>' + '*.js',
        '!' + '<%= config.paths.dest.js %>' + 'main.js',
        '<%= config.paths.dest.lib %>' + '**/*',
        '!' + '<%= config.paths.dest.lib %>' + 'require.js'
      ],
      source: '<%= config.paths.dest.js %>' + '*.js'
    },

    concat: {
    },

    connect: {
      server: {
        options: {
          port: 8888,
          base: '.'
        }
      }
    },

    copy: {
      bootstrap: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'bootstrap/fonts/*',
          dest: '<%= config.paths.dest.fonts %>'
        }, {
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'bootstrap/js/*.js',
          dest: '<%= config.paths.dest.bootstrap %>'
        }]
      },
      fontawesome: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'font-awesome/fonts/*',
          dest: '<%= config.paths.dest.fonts %>'
        }]
      },
      html: {
        files: [{
          expand: true,
          cwd: '<%= config.paths.src.html %>',
          src: '**/*.html',
          dest: '<%= config.paths.dest.dist %>',
          ext: '.html'
        }]
      },
      jquery: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'jquery/dist/jquery.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      },
      knockout: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'knockout/dist/knockout.debug.js',
          dest: '<%= config.paths.dest.lib %>',
          rename: function (dest, src) {
            return dest + src.replace('knockout.debug', 'knockout');
          }
        }]
      },
      lodash: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'lodash/lodash.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      },
      source: {
        files: [{
          expand: true,
          cwd: '<%= config.paths.src.js %>',
          src: '**/*.js',
          dest: '<%= config.paths.dest.js %>',
          ext: '.js',
          extDot: 'first'
        }]
      },
      require: {
        files: [{
          expand: true,
          flatten: true,
          src: '<%= config.paths.pkg %>' + 'requirejs-bower/require.js',
          dest: '<%= config.paths.dest.lib %>'
        }]
      }
    },

    jshint: {
      source: [
        'Gruntfile.js',
        '<%= config.paths.src.js %>' + '*.js',
        '!' + '<%= config.paths.src.js %>' + 'plugins.js'
      ]
    },

    less: {
      compile: {
        options: {
          strictMath: true,
          sourceMap: false,
          outputSourceFiles: false
        },
        src: [
          '<%= config.paths.pkg %>' + 'bootstrap/less/bootstrap.less',
          '<%= config.paths.pkg %>' + 'font-awesome/less/font-awesome.less',
          '<%= config.paths.src.less %>' + 'custom.less'
        ],
        dest: '<%= config.paths.dest.css %>' + 'custom.min.css'
      }
    },

    qunit: {
      all: {
        options: {
          urls: ['http://localhost:8888/tests/test-suite.html']
        }
      }
    },

    recess: {
      compress: {
        options: {
          compress: true
        },
        files: [{
          src: '<%= config.paths.dest.css %>' + 'custom.min.css',
          dest: '<%= config.paths.dest.css %>' + 'custom.min.css'
        }]
      },
      validate: {
        options: {
          noIDs: true,
          noJSPrefix: true,
          noOverqualifying: false,
          noUnderscores: true,
          noUniversalSelectors: false,
          prefixWhitespace: true,
          strictPropertyOrder: false,
          zeroUnits: false
        },
        files: [{
          src: '<%= config.paths.dest.css %>' + 'custom.min.css'
        }]
      }
    },

    requirejs: {
      compile: {
        options: {
          mainConfigFile: '<%= config.paths.dest.js %>' + 'main.js',
          baseUrl: '<%= config.paths.dest.js %>',
          name: 'main',
          out: '<%= config.paths.dest.js %>' + 'main.js',
          findNestedDependencies: true,
          insertRequire: ['main']
        }
      }
    },

    uglify: {
      prod: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= config.paths.dest.lib %>' + 'require.js'
          ],
          dest: '<%= config.paths.dest.lib %>'
        }],
      }
    },

    watch: {
      html: {
        files: ['<%= config.paths.src.html %>' + '**/*.html'],
        tasks: ['copy:html'],
        options: {
          spawn: false
        }
      },
      js: {
        files: [
          '<%= config.paths.src.js %>' + '**/*.js'
        ],
        tasks: ['js:dev'],
        options: {
          spawn: false
        }
      },
      less: {
        files: ['<%= config.paths.src.less %>' + '**/*.less'],
        tasks: ['less:dev'],
        options: {
          spawn: false
        }
      }
    }

  }); // End initConfig


  // Concat JS
  // amdifies files with a prefix and suffix wrapper:
  grunt.registerTask('amdify:js', function () {
    var tasks = [];

    _.map(amdifyFiles, function (file) {
      var deps = '';
      var vars = '';
      var exports = '';

      _.each(file.deps, function (d) {
        var split = d.split('=');
        var d1 = split[0];

        deps += '\'' + d1 + '\',';

        if (split.length > 1) {
          vars += split[1] + ',';
        }
      });

      if (deps.length) {
        deps = deps.slice(0, deps.length - 1);
      }
      if (vars.length) {
        vars = vars.slice(0, vars.length - 1);
      }

      if (file.exports) {
        exports = 'amdExports = ' + file.exports + ';';
      }

      var cmd = {
        dest: file.src + file.name + '.js'
      };

      _.extend(cmd, {
        src: [
          '<%= config.paths.src.js %>' + 'lib/amd-require-start.txt',
          file.src + file.name + '.js',
          '<%= config.paths.src.js %>' + 'lib/amd-require-end.txt'
        ],
        options: {
          process: function (src, filepath) {
            src = src.replace('<%= deps %>', deps);
            src = src.replace('<%= vars %>', vars);
            src = src.replace('<%= exports %>', exports);

            return src;
          }
        }
      });

      grunt.config('concat.' + [file.name], cmd);
      tasks.push('concat:' + file.name);
    });

    grunt.task.run(tasks);
  });

  grunt.registerTask('copy:libs', [
    'copy:bootstrap',
    'copy:fontawesome',
    'copy:jquery',
    'copy:knockout',
    'copy:lodash',
    'copy:require',
    'amdify:js'
  ]);

  grunt.registerTask('less:dev', [
    'clean:css',
    'less:compile',
    'autoprefixer:compile',
    'recess:validate'
  ]);

  grunt.registerTask('less:prod', [
    'less:dev',
    'recess:compress'
  ]);

  grunt.registerTask('js:dev', [
    'jshint:source',
    'clean:source',
    'copy:source',
    //'qunit'
  ]);

  grunt.registerTask('js:prod', [
    'clean:lib',
    'copy:libs',
    'connect',
    'js:dev',
    'requirejs',
    'uglify'
  ]);

  grunt.registerTask('source:dev', [
    'less:dev',
    'connect',
    'js:dev',
    'copy:html'
  ]);

  grunt.registerTask('source:prod', [
    'less:prod',
    'js:prod',
    'copy:html'
  ]);

  grunt.registerTask('build:dev', [
    'clean:build',
    'copy:libs',
    'copy:source',
    'source:dev'
  ]);

  grunt.registerTask('build:prod', [
    'clean:build',
    'copy:source',
    'source:prod',
    'clean:prod'
  ]);

  grunt.registerTask('update', [
    'connect',
    'watch'
  ]);


  // main tasks:
  grunt.registerTask('build', ['build:prod']);
  grunt.registerTask('default', ['build:dev']);
};

