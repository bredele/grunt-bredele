'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {
  grunt.initConfig({
    livereload: {
      port: 8989 
    },
    connect: {
      livereload: {
        options: {
          port: 9001,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, options.base)]
          }
        }
      }
    },
    compass: {                  
      dist: {                   
        options: {              
          sassDir : "src/theme/sass",
          cssDir : "src/theme/css",
          imagesDir: "src/theme/img",
          javascriptsDir : "src/js",
          fontsDir : "src/theme/fonts",
          environment : "production"
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
      },
      globals: {
        require: true,
        define: true
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "src/js",
          mainConfigFile: "src/js/config.js",
          name : "config",
          out: "dist/js/optimized.js"
        }
      }
    },
    regarde: {
      sass : {
        files: 'src/theme/sass/*.scss',
        tasks: ['compass:dist']
      },
      css: {
        files: 'src/theme/css/*.css',
        tasks: ['livereload']
      },
      js : {
        files : 'src/js/**/*.js',
        tasks : ['jshint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('build', ['requirejs']);
};