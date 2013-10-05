module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  grunt.initConfig
    uglify:
      minjs:
        files:
          'min.js': 'js.js'

  grunt.registerTask 'default', 'uglify'
