/*jshint node:true*/
module.exports = function(grunt) {

	"use strict";

	// Project configuration
	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js', 'aukera.js', 'components/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);
};
