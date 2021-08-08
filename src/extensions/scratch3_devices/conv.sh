# !/bin/sh
DIST=/mnt/c/Users/n-tom/fd_work/scratch-gui/static/deviceExt

if [ $# -ne 0 ] ; then
  LIST=$1
else
  LIST=`ls *.js`
fi

for file in $LIST
do
  newfile=`echo $file | sed -e 's/\.js/\.load.js/'`
  #                      //* -> /*_                    //*/ -> _*/                     /* -> //*                    */ -> //*/
  cat $file | sed -e 's/^\/\/\*$/\/\*_/g' | sed -e 's/^\/\/\*\/$/_\*\//g' | sed -e 's/^\/\*$/\/\/\*/g' | sed -e 's/^\*\/$/\/\/\*\//' > $DIST/$newfile
done
exit 0
