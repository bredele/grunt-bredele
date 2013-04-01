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
    // Configuration to be run (and then tested)
    regarde: {
      sass : {
        files: 'src/theme/sass/*.scss',
        tasks: ['compass:dist']
      },
      css: {
        files: 'src/theme/css/*.css',
        tasks: ['livereload']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');

  grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);
};