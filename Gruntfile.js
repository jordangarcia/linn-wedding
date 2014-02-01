var cwd = 'app/';
var staticFiles = ['*', '**/*', '!**/*.scss'];
var sassFiles = ['styles/*.scss'];
var devDir = 'build/dev/';
var devPort = 8002;

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dev: [devDir],
		},
		copy: {
			dev: {
				files: [{
					expand: true,
					cwd: cwd,
					src: ['*', '**/*', '!**/*.scss'],
					dest: devDir
				}]
			}
		},
		connect: {
			dev: {
				options: {
					port: devPort,
					keepalive: true,
					base: devDir
				}
			}
		},
		sass: {
			dev: {
				files: [{
					expand: true,
					cwd: cwd,
					src: sassFiles,
					dest: devDir,
					ext: '.css'
				}]
			}
		},
		watch: {
			options: {
				cwd: cwd,
				spawn: true
			},
			staticfiles: {
				files: staticFiles,
				tasks: ['copy:dev']
			},
			sass: {
				files: sassFiles,
				tasks: ['sass:dev']
			}
		},
		concurrent: {
			dev: ['connect:dev', 'watch:staticfiles', 'watch:sass']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('init:dev', ['clean:dev', 'copy:dev', 'sass:dev'])
	grunt.registerTask('start:dev', ['init:dev', 'concurrent:dev']);
};
