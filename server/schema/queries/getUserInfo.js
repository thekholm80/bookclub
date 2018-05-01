/*
  TODO:

  Validate jwt (protected query)?
*/

module.exports = {
  getUserInfo: async (_, { displayName }, { mongo: { Users } }) => {
    /**
      Queries db for user information

      @param {object} _ unused
      @param {string} displayName query parameter for user data
      @param {object} Users mongodb collection instance
      @returns {object} user information
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
