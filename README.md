<h1> Blockchain Beats</h1>
i've tried to imagine what a social network might look like 
on the blockchain. Especially in a niche area like old message boards. 

This is an idea for a sports beat writing website. It includes the following features:

 - anyone can create a beat (post).
 - posts can be voted on by members of the site. with more votes, a post can rise to the top of the page.
 - how do you keep from bad actors you might ask... well along with the ability the ability to vote for posts, there are ban votes. which gives the community the ability to ban any unnessecary post or any bad actors. (right now the default ban votes for a post being banned is set to 3)
 - beats can last on the contract for 48 hours max, for which then a new news cycle comes through.
 - there will be a feature that limits the number of words for each post. and if there is a beat writer that produces good content, you will have the ability to send their address ETH.

Functions:
- CreatePost
- UpVote
- DownVote
- FinalizePost

to check this out locally, clone the repo and run:

<p>yarn dev</p>

I think this would be a cool idea to see on the mainnet if given the proper time and money. It would use CRUD operations that would trigger post deletions, or awards depending on what other users want.
 
 Minimalism in smart contracts is important, so there would be other operations that would be handeled on the client-side first: word count for posts, a shelf life for each post.

 obviously there are a lot of flaws with this in practice, but I think the blockchain creates an opportunity for social networks of niche communities to thrive, by allowing posts to be controlled by accountability within the community.

 I haven't had the time to add a front-end to it yet.
