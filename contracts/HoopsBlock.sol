// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// SAME AS 4BEAT EXCEPT WANT TO TEST IF THIS WOULD BE EASIER TO STORE EACH POST IN A STRUCT
// THEN AFTER 48 HOURS OR UPON BEING BANNED, A FLAG MAPPING FOR THE POST STRUCT IS SET TO FALSE
// WHICH EMITS AN EVENT DECLARING THE POST INACTIVE AND OMMITTING IT FROM BEING VIEWED. 
// IF IT'S POSSIBLE TO DROP IT OFF THE MAPPING LIST THAT WOULD BE MOST EFFICIENT I THINK

contract HoopsBlock {
    
    struct Post {
        address author;
        string title;
        uint256 upVotes;
        mapping(address => bool) alreadyUpped;
        uint256 downVotes;
        mapping(address => bool) alreadyDowned;
        uint256 index;
        uint256 timePosted;
    }
    
    event PostSubmitted(
        address indexed author,
        uint256 index,
        string title,
        uint256 time
        );

    event PostUpVoted(
        address indexed voter,
        string title
    );

   event PostDownVoted(
        address indexed voter,
        string title
    );

    event PostRemoved(
        address indexed author,
        string title,
        uint256 index,
        uint256 removeTime
        );
        
    mapping(address => Post) private postsList;
    address[] private postsIndex;
    uint256 numPosts;

    
    function isPost(address _author) external view returns (bool) {
        if (postsIndex.length == 0) return false;
        bool result = postsIndex[postsList[_author].index] == _author;
        return result;
    }
    
    function createPost(
        address payable _author,
        string memory _title
        ) public returns (uint256 index) {
            require(!this.isPost(_author), "this author already has a post up");

            Post storage p = postsList[_author];
            postsIndex.push(_author);
            
            p.author = _author;
            p.title = _title;
            p.upVotes = 0;
            p.downVotes = 0;
            p.index = postsIndex.length - 1;
            p.timePosted = block.timestamp;
            
            emit PostSubmitted(
                    _author,
                    postsList[_author].index,
                    _title,
                    block.timestamp);

            // postsIndex.push(numPosts);
            return postsIndex.length - 1;
    }
    
    function upVote(address _author) external {
        require(_author != msg.sender, "cannot upvote your own post");
        Post storage p = postsList[_author];
        require(!p.alreadyUpped[msg.sender], "you already upvoted");
        p.upVotes++;
        p.alreadyUpped[msg.sender] = true;

        emit PostUpVoted(msg.sender, p.title);
        
    }
    
    function downVote(address _author) external {
        require(_author != msg.sender, "cannot downvote your own post");
        Post storage p = postsList[_author];
        require(!p.alreadyDowned[msg.sender], "you already downvoted");
        p.downVotes++;
        p.alreadyDowned[msg.sender] = true;
        
        emit PostDownVoted(msg.sender, p.title);
    
        if (p.downVotes == 3) {
            uint256 postToDelete = p.index;
            address keyToMove = postsIndex[postsIndex.length - 1];
            
            postsIndex[postToDelete] = keyToMove;
            postsList[keyToMove].index = postToDelete;
            postsIndex.pop();
            
            emit PostRemoved(
                _author,
                p.title,
                postToDelete,
                block.timestamp
                );
        }
        
    }
    
    function finalizePost(address _author) external {
        // each post will have a shelf life of 48 hours
        // I THINK ITS BETTER TO TRACK THE TIME ON THE CLIENT SIDE AND THEN CALL  THIS FUNCTION WHEN 
        // CLIENT-SIDE TRIGGERED SO ILL GO WITH THAT 
        require(postsIndex[postsList[_author].index] == _author, "post has to exist to delete it");
        Post storage p = postsList[_author];
        
        uint256 postToDelete = p.index;
        address keyToMove = postsIndex[postsIndex.length - 1];
        
        postsIndex[postToDelete] = keyToMove;
        postsList[keyToMove].index = postToDelete;
        postsIndex.pop();
        
        emit PostRemoved(
            _author,
            p.title,
            postToDelete,
            block.timestamp
            );
        
    }
    
    function numberOfActivePosts() external view returns (uint256) {
        return postsIndex.length;
    }
    

}