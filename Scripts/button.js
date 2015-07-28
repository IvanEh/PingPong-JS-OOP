function Button(caption, x, y, width, height, state, color, onClick){
	this.caption = caption;
	this.color = color;
	this.state = state;
	this.shadowWidth = 3;
	this._handlePause = false;
	this.onClick = onClick;
	this._fontColor = "#0000ff";

	if(x == "center"){
		x = (state.game.width - width)/2;
	}
	this.texture = state.add.bitmapData(width + this.shadowWidth, height + this.shadowWidth);

	this.sprite = state.add.sprite(x, y, this.texture);
	this.sprite.inputEnabled = true;
	this.sprite.events.onInputDown.add(onClick, this);
	this.updateTexture();
}

Button.prototype.updateTexture = function() {
	var ctx = this.texture.context;
	
	
	this.texture.shadow("gray",5,  this.shadowWidth, this.shadowWidth);
	this.texture.rect(0, 0, this.sprite.width - this.shadowWidth, this.sprite.height - this.shadowWidth, this.color, true);

	
	ctx.font =  "13px Arial";
	var bounds = ctx.measureText(this.caption);
	bounds.height = ctx.measureText("M").width;
	
	var x = (this.sprite.width - this.shadowWidth - bounds.width)/2;
	var y = (this.sprite.height - this.shadowWidth - bounds.height)/2+bounds.height;

	this.texture.shadow();

	this.texture.text(this.caption, x, y, ctx.font, this._fontColor, true);
};

Object.defineProperty(Button.prototype, "handlePause", 
{
	get: function(){
		return this._handlePause;
	},

	set: function(val){
		if(val){
			this._handlePause = true;
			this._listener = this.state.input.onUp.add(
			function(e) {
				var rect = new Phaser.Rectangle(this.sprite.x, this.sprite.y,
						this.sprite.width, this.sprite.height);
				if(rect.contains(e.x, e.y)){
					this.onClick();
				}
			}, this);
		}else{
			this._handlePause = false;
			this._listener.detach();
			this._listener = null;
		}
	}
}
);

Object.defineProperty(Button.prototype, "fontColor", 
{
	get: function() {
		return this._fontColor;
	},

	set: function(val) {
		this._fontColor = val;
		this.updateTexture();
	}
});