var gulp = require('gulp');

gulp.task('pre-commit',function(){
    return gulp.src('.git-hooks/*')
    .pipe(gulp.dest('.git/hooks/'))
})

gulp.task('default',gulp.parallel('pre-commit'));
