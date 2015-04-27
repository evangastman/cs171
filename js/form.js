// /*
//  Hi! This looks at the income form at the top of the webpage and triggers an event when it changes
// */

Form = function(_parentElement, _mhData, _crimeData, _allData, _MyEventHandler){
    this.parentElement = _parentElement;
    this.mhData = _mhData;
    this.crimeData = _crimeData;
    this.allData = _allData;
    this.eventHandler = _MyEventHandler;
    
    this.initForm();
}

// figure out what income button is selected
Form.prototype.nowDisplay = function () {
  var that = this;

  var x = this.parentElement[0][0]["income"].value;
  console.log(x);
  return x;
}


Form.prototype.initForm = function(){
  var that = this;

  this.parentElement.on("change", function () {
    $(that.eventHandler).trigger("formChanged", that.nowDisplay());
  });
}