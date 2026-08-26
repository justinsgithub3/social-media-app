const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        // user is already logged in, redirect to protected page
        return res.redirect("/");
    }
    next(); // not logged in, continue to login page
}