module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.initConfig
    uglify:
      minjs:
        files:
          'min.js': 'js.js'

    watch:
      js:
        files: 'js.js'
        tasks: ['default']

  grunt.registerTask 'default', 'uglify'
