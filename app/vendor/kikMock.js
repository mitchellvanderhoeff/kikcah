/**
 * Created by mitch on 2014-04-03.
 */

if (!(window.kik && window.kik.enabled)) {
   window.kik = {
      getUser: function (callback) {
         callback({
            username: 'theMizzler',
            fullName: 'Mizzl Drizzl'
         })
      }
   }
}