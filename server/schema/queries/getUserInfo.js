/*
  TODO:

  Validate jwt (protected query)?
*/

module.exports = {
  getUserInfo: async (_, { displayName }, { mongo: { Users } }) => {
    /*
      Queries db for user information

      :_: unused
      :displayName: <str> Query parameter for user data
      :Users: <obj> mongodb collection instance
      :returns: <obj> user information
    */

    const dbUserSearch = await Users.findOne({ displayName }).catch(err => { throw err; });
    return ({
      displayName: dbUserSearch.displayName,
      firstName: dbUserSearch.firstName,
      lastName: dbUserSearch.lastName,
      city: dbUserSearch.city,
      state: dbUserSearch.state
    });
  }
};
