function negate(item) {
	return '!' + item;
}
var cwd = 'app/';
var jadeFiles = ['*.jade', '**/*.jade'];
var sassFiles = ['styles/*.scss', 'styles/**/*.scss'];
var scriptFiles = ['scripts/*.js'];
// take all files in working dir and one level down and concat the negations to jade and sass files
var assetFiles = ['*', '**/*'].concat(jadeFiles.map(negate)).concat(sassFiles.map(negate)).concat(scriptFiles.map(negate));
var devDir = 'build/dev/';
var devPort = 8002;

var prodDir = 'build/prod/';

var MAIN_SCRIPT = 'app/scripts/main.js';

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
					src: assetFiles,
					dest: devDir
				}]
			}
		},
		connect: {
			dev: {
				options: {
					hostname: '0.0.0.0',
					port: devPort,
					keepalive: true,
					base: devDir
				}
			}
		},
		browserify: {
			dev: {
				src: MAIN_SCRIPT,
				dest: devDir + 'scripts/main.js'
			},
			prod: {
				src: MAIN_SCRIPT,
				dest: prodDir + 'scripts/main.js'
			},
		},
		jade: {
			dev: {
				options: {
					pretty: true,
					client: false
				},
				files: [{
					expand: true,
					cwd: cwd,
					src: jadeFiles,
					dest: devDir,
					ext: '.html'
				}]
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
			assets: {
				files: assetFiles,
				tasks: ['copy:dev']
			},
			jade: {
				files: jadeFiles,
				tasks: ['jade:dev']
			},
			sass: {
				files: sassFiles,
				tasks: ['sass:dev']
			},
			scripts_dev: {
				files: scriptFiles,
				tasks: ['browserify:dev']
			}
		},
		concurrent: {
			dev: ['connect:dev', 'watch:assets', 'watch:sass', 'watch:jade', 'watch:scripts_dev']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('init:dev', ['clean:dev', 'copy:dev', 'sass:dev', 'jade:dev', 'browserify:dev']);
	grunt.registerTask('start:dev', ['init:dev', 'concurrent:dev']);
};
