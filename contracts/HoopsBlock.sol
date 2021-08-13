// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// this contract is simply an idea for a niche community discussion board on the blockchain
// it's very beginner but something maybe worthy of expanding on.


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
        
    // a mapping used to index to specific posts using the author's address
    mapping(address => Post) private postsList;
    // a list of address's used for CRUD operations
    address[] private postsIndex;
    uint256 numPosts;

    // function that returns true if that author already has a post up
    function isPost(address _author) external view returns (bool) {
        if (postsIndex.length == 0) return false;
        bool result = postsIndex[postsList[_author].index] == _author;
        return result;
    }
    
    // allows author's to post, but only once per news cycle (48 hours)
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
            
            // once post has been submitted this event is triggered

            emit PostSubmitted(
                    _author,
                    postsList[_author].index,
                    _title,
                    block.timestamp);

            return postsIndex.length - 1;
    }
    
    // allows users to upvote, but only once and not on their own post
    function upVote(address _author) external {
        require(_author != msg.sender, "cannot upvote your own post");
        Post storage p = postsList[_author];
        require(!p.alreadyUpped[msg.sender], "you already upvoted");
        p.upVotes++;
        p.alreadyUpped[msg.sender] = true;

        emit PostUpVoted(msg.sender, p.title);
        
    }
    
    // allows users to downvote posts, but only once and not on own posts
    // once a post receives 3 downvotes, it is taken off the page.
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
    
    // once a post has reached it's 48 hour shelf life, it is taken off the page to open up for a new cycle.
    function finalizePost(address _author) external {

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
    
    // a call that returns number of posts currently active
    function numberOfActivePosts() external view returns (uint256) {
        return postsIndex.length;
    }
    

}