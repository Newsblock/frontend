'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    sass: {
      options: {
        outputStyle: 'compressed'
      },
      dist: {
        files: {
          'public/css/style.css': 'public/css/style.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 5 version', 'Firefox >= 21', 'Chrome >= 30', 'Safari >= 4']
      },
      no_dest: {
        src: 'public/css/style.css' // globbing is also possible here
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'app/**/*.js',
          'app.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          'public/css/{,*/}*.{scss,sass}'
        ],
        tasks: ['sass', 'autoprefixer'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['app/views/{,**/}*.handlebars'],
        options: {
          livereload: reloadPort
        }
      }
    },
    uglify: {
        options: {
            mangle: false
        },
        inline_prod: {
            files: {
                'app/views/partials/mainjs.handlebars': ['public/scripts/main.js']
            }
        }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'sass',
    'uglify:inline_prod',
    'develop',
    'watch'
  ]);
};
