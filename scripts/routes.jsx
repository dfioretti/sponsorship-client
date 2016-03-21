var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var SmallApp = require('./components/SmallApp.react.jsx');
var LoginPage = require('./components/session/LoginPage.react.jsx');
var StoriesPage = require('./components/stories/StoriesPage.react.jsx');
var StoryPage = require('./components/stories/StoryPage.react.jsx');
var StoryNew = require('./components/stories/StoryNew.react.jsx');
var SignupPage = require('./components/session/SignupPage.react.jsx');
var AccountLogin = require('./components/session/AccountLogin.react.jsx');
var CreateAccount = require('./components/session/CreateAccount.react.jsx');
var PasswordRecovery = require('./components/session/PasswordRecovery.react.jsx');
var ResetPassword = require('./components/session/ResetPassword.react.jsx');
var EditorComponent = require('./components/editors/editor_component.jsx');
var DashboardHome = require('./components/dashboards/dashboard_home.jsx');
var UsersIndex = require('./components/session/UsersIndex.jsx');
var EditorScore = require('./components/editors/EditorScore.jsx');
var ScoreIndex = require('./components/editors/ScoreIndex.jsx');
var PortfolioDashboard = require('./components/dashboards/PortfolioDashboard.jsx');
var Dev = require('./components/Dev.jsx');
var PortfolioOverview = require('./components/routes/PortfolioOverview.jsx');
var EntityOverview = require('./components/routes/EntityOverview.jsx');
var ComponentsIndex = require('./components/routes/ComponentsIndex.jsx');
var DataIndex = require('./components/routes/DataIndex.jsx');
var AssetDashboard = require('./components/dashboards/AssetDashboard.jsx');
var Workspace = require('./components/routes/Workspace.jsx');




module.exports = (
  <Route handler={SmallApp}>
    <Route name='account_login' handler={AccountLogin} path='/account_login' />
    <Route name='create_account' handler={CreateAccount} path='/create_account' />
    <Route name='password_recovery' handler={PasswordRecovery} path='/password_recovery' />
    <Route name='reset_password' handler={ResetPassword} path='/reset_password' />
    <Route name='dev' handler={Dev} path='/dev' />
    <Route name='editor_component' handler={EditorComponent} path='/apt/editor_component' />
    <Route name='editor_component_update' handler={EditorComponent} path='/apt/editor_component/:id' />
    <Route name='dashboard_home' handler={DashboardHome} path='/apt/dashboard/:id' />
    <Route name='users' handler={UsersIndex} path='admin/users'/>
    <Route name='editor_score' handler={EditorScore} path='/apt/editor_score' />
    <Route name='editor_score_update' handler={EditorScore} path='/apt/editor_score/:id' />
    <Route name='score_index' handler={ScoreIndex} path='apt/scores/score_index' />
    <Route name='components_index' handler={ComponentsIndex} path="components_index" />
    <Route name='data_index' handler={DataIndex} path='data_index' />

    <Route name='portfolio_dashboard' handler={PortfolioDashboard} path='apt/portfolio/dashboard' />
    <Route name='asset_dashboard' handler={PortfolioDashboard} path="apt/asset/dashboard/:id" />
    <Route name='portfolio_overview' handler={PortfolioOverview} path='portfolio_overview' />
    <Route name='asset_overview' handler={EntityOverview} path='asset_overview' />
    <Route name='workspace' handler={Workspace} path='workspace' />

    <Route name='fifa_dashboard' handler={Dev} path='/dev' />
    <Route name='choose_company' handler={Dev} path='/dev' />

    <Route name="login" path="/login" handler={AccountLogin} />
    <Route name="signup" path="/signup" handler={SignupPage} />
    <Route name="stories" path="/stories" handler={StoriesPage}/>
    <Route name="story" path="/stories/:storyId" handler={StoryPage} />
    <Route name="new-story" path="/story/new" handler={StoryNew}/>
    <DefaultRoute handler={PortfolioDashboard} />
  </Route>
);
