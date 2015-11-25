window.ngshim = function (appName = 'app', angularVersion, componentsDir = 'components') {

  if (!angularVersion && angular) angularVersion = angular.version;

  if (angularVersion > 1.5)
    window.ngsham = new ComponentTwoAlpha(appName, componentsDir);
  if (angularVersion == 1.5)
    window.ngsham = new ComponentOneFive(appName, componentsDir);
  else if (angularVersion >= 1.4)
    window.ngsham = new ComponentOneFour(appName, componentsDir);
  else if (angularVersion >= 1.3)
    window.ngsham = new ComponentOneThree(appName, componentsDir);
  else
    throw new Error('Angular versions less than 1.3 are not supported.');

  window.ngshambles = new ComponentOld(appName, componentsDir);
}
