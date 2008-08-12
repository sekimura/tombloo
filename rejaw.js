models.register({
	name : 'Rejaw',
	ICON : 'http://rejaw.com/images/logo/favicon.ico',
	URL : 'http://rejaw.com/',
	
	check : function(ps){
		return !ps.file;
	},
	
	getAuthCookie : function(){
		if(getCookieString('rejaw.com').match(/_session_id=(.+?);/))
			return RegExp.$1;
		
		throw new Error('AUTH_FAILD');
	},
	
	getToken : function(){
		return doXHR('http://rejaw.com/account/profile').addCallback(function(res){
			if(res.responseText.match('","session":"(.*?)","'))
				return RegExp.$1;
		});
	},
	
	post : function(ps){
		if(!this.getAuthCookie())
			throw new Error('AUTH_FAILD');
		
		var self = this;
		return self.getToken().addCallback(function(token){
			return doXHR('http://api.rejaw.com/v1/conversation/shout', {
				redirectionLimit : 0,
				sendContent : {
					session  : token,
					text :  joinText([ps.item, ps.itemUrl, ps.body, ps.description], ' ', true),
				},
			});
		});
	},
});
