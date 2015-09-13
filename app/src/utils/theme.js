import Styles from 'mui/styles';
import ColorManipulator from 'mui/utils/color-manipulator';
let { Colors, Typography } = Styles;

const Types = {
  LIGHT: require('mui/styles/themes/light-theme'),
  DARK: require('mui/styles/themes/dark-theme'),
};

let Theme = Types.LIGHT;

Theme.getPalette=function(){
	return {
      primary1Color: Colors.blue500,
      primary2Color: Colors.blue700,
      primary3Color: Colors.blue100,
      accent1Color: Colors.pinkA200,
      accent2Color: Colors.pinkA400,
      accent3Color: Colors.pinkA100,
      textColor: Colors.darkBlack,
      canvasColor: Colors.white,
      borderColor: Colors.grey300,
      disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
	}
}

let componentTheme = Theme.getComponentThemes(Theme.getPalette());

module.exports = {
    types: Types,
    template: Theme,

    spacing: Theme.spacing,
    contentFontFamily: 'Roboto, sans-serif',

    palette: Theme.getPalette(),
    component: componentTheme,
}