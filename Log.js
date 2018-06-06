class Log {
	constructor(target) {
		
		this._outputLevels = new Map();
		
		["INFO","DEBUG","WARN","ERROR","FATAL"].map((label,level) => {
			this._outputLevels.set (level, label);
		})
		this._history = [];
		this._outputLevel;
		this.historySize = 200;
		this.outputLevel = 1;
		this.target = target;
	}
	
	info(msg) {
		this._printMsg(this._addMessage(msg,0));
	};
	
	debug(msg) {
		this._printMsg(this._addMessage(msg,1));
	}
	
	warn(msg) {
		this._printMsg(this._addMessage(msg,2));
	}
	
	error(msg) {
		this._printMsg(this._addMessage(msg,3));
	}
	
	fatal(msg) {
		this._printMsg(this._addMessage(msg,4));
	}
	
	clear() {
		//this._history.length = 0;
		this._printMsg({msg:null,level:0});
	}
	
	set target (object) {
		if(!object.innerHTML) {
			throw Error("Log target must be an HTML node with an innerHTML property");
		} else {
			this._target = object;
			return this.target
		}
	}
	
	get target () {
		return this._target;
	}
	
	get outputLevel() {
		return this._outputLevel;		
	}
	
	set outputLevel(val) {
		let level=-1;
		switch (typeof val) {
			case "number":
				level = (val >= 0 && val < this._outputLevels.size) ? val : level;
				break;
			case "string":
				level = this._getOutputLevelFromLabel(val);
				break;
		}
		
		if (level >= 0) { 
			this._outputLevel = level; 
		} else {
			throw Error (`Invalid output level '${val}'.`)
		}
		return this.outputLevel
	}
		
		_getOutputLevelFromLabel(str) {
			let level=null, index=0;
				for (let value of this._outputLevels.values()) {
					if (value === str) {
						level = index;
						break;
					}
					index++;
				}
			return level;
		}

	_printMsg(msgObject) {
		const {level,msg,timestamp} = msgObject;
		let output = " "
		if (msg != null && this.outputLevel <= level) {
			if (this._target.innerHTML) {
				output = this._target.innerHTML	
			}
			output += `[${this._outputLevels.get(level)}] ${msg}<br />`;	
		}
		this._target.innerHTML = output;
	}
	
	_addMessage(msg,level) {
			const messageObject = this._createMessageObject(msg,level);
		
		if (msg != null) {
			if (this._history.length > this.historySize-1) {
				this._history.shift();
			}
			this._history.push({...messageObject});
		}
		return messageObject;
}

	_createMessageObject(msg="",level=0) {
		const timestamp = Date.now()
		return {msg,level,timestamp};
	}
}
