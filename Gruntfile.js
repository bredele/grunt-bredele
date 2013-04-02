'use strict';
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        //stripBanners: true, //remove other banners
        banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '   Copyright (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author %>.\n' +
            '   Licensed : <%= _.pluck(pkg.licenses, "type").join(", ") %> \n' +
            '   see : <%= pkg.url %>*/\n'
      },
     dist: {
        src: ['dist/js/optimized.js'],
        //change for "dist/js/<%= pkg.name %>-<%= pkg.version %>.js"
        dest: 'dist/js/optimized.js'
      }
    },
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
      all : ['src/js/**/*.js', '!src/js/lib/**/*.js'],
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
          out: "dist/js/optimized.js",
          paths : {
            amd : "lib/require"
          },
          include : "amd"
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
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['livereload-start', 'connect', 'regarde']);
  grunt.registerTask('build', ['requirejs', 'concat']);
};