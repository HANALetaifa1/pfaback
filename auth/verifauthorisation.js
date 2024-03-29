const requireAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  const requireUser = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  app.get('/admin-only', requireAdmin, (req, res) => {
    res.status(200).json({ message: 'You are an admin' });
  });
  
  router.get('/user-profile', (req, res) => {
    
    res.status(200).json({ message: `Welcome, ${req.session.user.username}` });
  });