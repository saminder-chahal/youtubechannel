$(document).ready(function(){
	document.addEventListener('deviceready', OnDeviceReady, false);
});

function OnDeviceReady(){

	//Check Channel in Localstorage

    if(localStorage.channel == null || localStorage.channel == ''){
      // Ask User for Channel
      $('#popupDialog').popup("open");
    }else{
    	var channel = localStorage.getItem('channel');
    }

	getPlaylist(channel);

	$(document).on('click', '#listvideos li', function(){
              showVideo($(this).attr('videoId'));
	});

	$('#channelBtnOK').click(function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlaylist(channel);
	});
}

function getPlaylist(channel){
	$('#listvideos').html('');
	$.get(
            "https://www.googleapis.com/youtube/v3/channels",
            {
            	part: 'contentDetails',
            	forUsername: channel,
            	key: 'AIzaSyCb_EpCHiOcsXDXF7VoO1xfYtcdJ6fZ_GI'
            },
            function(data){
            	console.log(data);
            	$.each(data.items, function(i, item){
            		console.log(item); 
            		playlistId = item.contentDetails.relatedPlaylists.uploads;
            		getVideos(playlistId, 10);

            	});
            }
		);
}

function getVideos(playlistId, maxResults){
	$.get(
          "https://www.googleapis.com/youtube/v3/playlistItems",
          {
          	part: 'snippet',
          	maxResults: maxResults,
          	playlistId: playlistId,
          	key: 'AIzaSyCb_EpCHiOcsXDXF7VoO1xfYtcdJ6fZ_GI'
          },
          function(data){
          	    $.each(data.items, function(i, item){
          		id = item.snippet.resourceId.videoId;
          		title = item.snippet.title;
          		thumb = item.snippet.thumbnails.default.url;
          		$('#listvideos').append('<li videoId ="'+id+'"><img src = "'+thumb+'"><h3>'+title+'</h3></li>');
          		$('#listvideos').listview('refresh');
          	});
          }
		);
}

function showVideo(id){
	console.log('Showing Video '+ id);
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$('#showvideos').html(output);
}

function setChannel(channel){
    localStorage.setItem('channel', channel);
    consile.log('Channel Set: '+channel);

}
