// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: 'AIzaSyDj_qwUrYCUsEstUJE9wo2ZpuLD_1LGjVY',
  authDomain: 'balloon-battle.firebaseapp.com',
  databaseURL: 'https://balloon-battle.firebaseio.com',
  projectId: 'balloon-battle',
  storageBucket: 'balloon-battle.appspot.com',
  messagingSenderId: '20012671944',
  appId: '1:20012671944:web:751a2fb4a307a7e04196fd',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.firestore();

function getConfigServerRef() {
  return database.collection('configurations')
    .doc('configurations');
}

let config = {};

function clearTable(tableElement) {
  for (let i = 2; i < tableElement.rows.length;) {
    tableElement.deleteRow(i);
  }
}

function openTab(tab) {
  const x = document.getElementsByClassName('config');
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  document.getElementById(tab).style.display = 'block';
}

function updateConfig(name, value) {
  getConfigServerRef()
    .update({
      [name]: value,
    })
    .catch(function (error) {
      console.log('Data could not be saved.' + error);
    });
}

function getPositiveCheckMark() {
  return '<img width="24px" height="24px" src="images/iconfinder_Checkmark_1891021.png"/>';
}

function getNegativeCheckMark() {
  return '<img width="24px" height="24px" src="images/iconfinder_Close_1891023.png"/>';
}

function loadServerConfig() {
  getConfigServerRef()
    .onSnapshot(doc => {
      if (doc.exists) {
        this.config = {
          spriteSize: doc.data().balloon_size,
          specialSprite: doc.data().special_balloon,
          surpriseSprite: doc.data().surprise_balloon,
          baseSpeed: doc.data().base_speed,
          maxSpriteQuantity: doc.data().max_balloon_quantity,
          isPaused: doc.data().is_paused,
          hasFinished: doc.data().has_finished,
          density: doc.data().density,
          showName: doc.data().show_name,
          showScore: doc.data().show_score,
          showId: doc.data().show_id,
          showWind: doc.data().show_wind,
          windSpeed: doc.data().wind_speed,
          gameOpen: doc.data().game_open,
          showSpriteSpeed: doc.data().show_sprite_speed,
          types: doc.data().types,
        };
        this.applyConfig();
      } else {
        console.error('Config doesn\'t exist on the server');
      }
    });
}

function applyCheckBoxConfig(name, nameControl, value) {
  document.getElementById(name).innerHTML = value ? getPositiveCheckMark() : getNegativeCheckMark();
  document.getElementById(nameControl).checked = value;
}

function applySliderConfig(name, nameControl, outputControl, value) {
  document.getElementById(name).innerHTML = value;
  document.getElementById(nameControl).value = value;
  document.getElementById(outputControl).innerHTML = value;
}

function applyDataTableTypesConfig(typesSummaryTable, types) {
  clearTable(typesSummaryTable);

  Object.values(types)
    .forEach(type => {
      const row = typesSummaryTable.insertRow(-1);

      const typeCell = row.insertCell(0);
      typeCell.setAttribute('class', 'column-table');
      typeCell.innerHTML = type.type;

      const pointsCell = row.insertCell(1);
      pointsCell.setAttribute('class', 'column-table');
      pointsCell.innerHTML = type.points;

      const probCell = row.insertCell(2);
      probCell.setAttribute('class', 'column-table');
      probCell.innerHTML = type.prob;
    });
}

function applyConfig() {
  applyCheckBoxConfig('showName', 'showNameControl', this.config.showName);
  applyCheckBoxConfig('showId', 'showIdControl', this.config.showId);
  applyCheckBoxConfig('showScore', 'showScoreControl', this.config.showScore);
  applyCheckBoxConfig('showWind', 'showWindControl', this.config.showWind);
  applyCheckBoxConfig('showSpriteSpeed', 'showSpriteSpeedControl', this.config.showSpriteSpeed);

  applySliderConfig('baseSpeed', 'baseSpeedControl', 'baseSpeedOutputControl', this.config.baseSpeed);
  applySliderConfig('windSpeed', 'windSpeedControl', 'windSpeedOutputControl', this.config.windSpeed);
  applyCheckBoxConfig('isPaused', 'isPausedControl', this.config.isPaused);
  applyCheckBoxConfig('hasFinished', 'hasFinishedControl', this.config.hasFinished);
  applyCheckBoxConfig('gameOpen', 'gameOpenControl', this.config.gameOpen);

  applySliderConfig('spriteSize', 'spriteSizeControl', 'spriteSizeOutputControl', this.config.spriteSize);
  applyCheckBoxConfig('specialSprite', 'specialSpriteControl', this.config.specialSprite);
  applyCheckBoxConfig('surpriseSprite', 'surpriseSpriteControl', this.config.surpriseSprite);
  applySliderConfig('density', 'densityControl', 'densityOutputControl', this.config.density);
  applySliderConfig('maxSpriteQuantity', 'maxSpriteQuantityControl', 'maxSpriteQuantityOutputControl', this.config.maxSpriteQuantity);

  applyDataTableTypesConfig(document.getElementById('summary-types-table'), this.config.types);
  dataTableTypesConfigEdit(document.getElementById('edit-types-table'), this.config.types);
}

function handleOnChangeType(element, dbName) {
  element.addEventListener('change', (event) => {
    updateConfig(dbName, Number(event.target.value));
  });
}

function dataTableTypesConfigEdit(typesEditTable, types) {
  clearTable(typesEditTable);

  Object.values(types)
    .forEach(type => {
      const row = typesEditTable.insertRow(-1);

      const typeCell = row.insertCell(0);
      typeCell.setAttribute('class', 'column-table');
      typeCell.innerHTML = type.type;

      const pointsCell = row.insertCell(1);
      pointsCell.setAttribute('class', 'column-table');
      pointsCell.innerHTML = '<input type="text" name="type.points" value="' + type.points + '"/>';
      handleOnChangeType(pointsCell, 'types.' + [type.type] + '.points');

      const probCell = row.insertCell(2);
      probCell.setAttribute('class', 'column-table');
      probCell.innerHTML = '<input type="text" name="type.prob" value="' + type.prob + '"/>';
      handleOnChangeType(probCell, 'types.' + [type.type] + '.prob');
    });
}

function handleOnChangeCheckBox(controlName, dbName) {
  document.getElementById(controlName)
    .addEventListener('change', (event) => {
      updateConfig(dbName, event.target.checked);
    });
}

function showSliderValue(outputControl, val) {
  document.getElementById(outputControl).innerHTML = val;
}

function handleOnChangeSlider(controlName, outputControl, dbName) {
  document.getElementById(controlName)
    .addEventListener('change', (event) => {
      updateConfig(dbName, Number(event.target.value));
    });

  document.getElementById(controlName)
    .addEventListener('input', (event) => {
      showSliderValue(controlName, event.target.value);
    });
}

function setupVisualEvents() {
  handleOnChangeCheckBox('showNameControl', 'show_name');
  handleOnChangeCheckBox('showScoreControl', 'show_score');
  handleOnChangeCheckBox('showIdControl', 'show_id');
  handleOnChangeCheckBox('showWindControl', 'show_wind');
  handleOnChangeCheckBox('showSpriteSpeedControl', 'show_sprite_speed');
}

function setupGameEvents() {
  handleOnChangeSlider('baseSpeedControl', 'baseSpeedOutputControl', 'base_speed');
  handleOnChangeSlider('windSpeedControl', 'windSpeedOutputControl', 'wind_speed');
  handleOnChangeCheckBox('isPausedControl', 'is_paused');
  handleOnChangeCheckBox('hasFinishedControl', 'has_finished');
  handleOnChangeCheckBox('gameOpenControl', 'game_open');
}

function setupSpriteEvents() {
  handleOnChangeSlider('spriteSizeControl', 'spriteSizeOutputControl', 'balloon_size');
  handleOnChangeCheckBox('specialSpriteControl', 'special_balloon');
  handleOnChangeCheckBox('surpriseSpriteControl', 'surprise_balloon');
  handleOnChangeSlider('densityControl', 'densityOutputControl', 'density');
  handleOnChangeSlider('maxSpriteQuantityControl', 'maxSpriteQuantityOutputControl', 'max_balloon_quantity');
}

window.addEventListener('load', () => {
  loadServerConfig();
  setupVisualEvents();
  setupGameEvents();
  setupSpriteEvents();
});