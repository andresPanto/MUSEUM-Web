-----------------------------------ROLES---------------------------------
insert into role values (0,'client');
insert into role values (0,'admin');
-----------------------------------USER----------------------------------
insert into user values (0,'client','123','example@domain.com','John Doe','999999123','/images/users/user1.png',1);
insert into user values (0,'admin','123','admin@abc.com','Bob Collins','88888123','/images/users/admin1.png',1);
--------------------------------USER-ROLE--------------------------------
insert into user_role values (0,1,1);
insert into user_role values (0,2,2);
---------------------------------ACTIVITY--------------------------------
--Performances
insert into activity values (0,'The Museum Is The Body', 'Peformance','Auditorium A','2020-10-12','2020-10-20','Choreographer, dancer, and director of France’s Musée de la danse, Boris Charmatz spoke with curator and Center colleague Simon Dove on how a living collection of dance can be conceptualized. “In dance, the museum is the body,” Charmatz said. “We don’t have museums because the body is the archival place. It is the place where we have the scores, we have the artworks…The main source is the dancer’s body.” Charmatz also discussed the issue of authorship within a “museum of dance,” bringing into question what the dancer and the choreographer both “own” in the preservation of a dance work.','02:00','Boris Charmatz','19985546737',10.00,'/activities/performances/body.png',1);
insert into activity values (0,'Dancing in the Museum', 'Peformance','Auditorium B','2020-11-20','2020-11-25','Audiences are accustomed to seeing dancers in a theater setting, and with that familiarity comes a set of assumptions about the nature of their relationship with the performers. In a museum, however, visitors may choose different ways to engage with a performance—and may even question whether the work they’re seeing qualifies as art at all. Choreographer Maria Hassabi discusses the unique challenges that emerge from this tension and how it can evoke new ways of moving and, for audiences, new ways of interpreting with the work.','01:30','Maria Hasabi','17685376792',8.50,'/activities/performances/dance.png',1);
insert into activity values (0,'Feeling of Liveness', 'Peformance','Entrance 5','2021-01-05','2021-01-06','Tracie Morris was not present when audiences heard the sound poems she contributed to the Whitney Biennial, but she wanted them to be able to experience the “intimacy of a live event” anyway. Informed by her improvisational background, Morris used a variety of techniques to ensure the recorded work did not feel stiff, in both presentation and production. “If I felt that it didn’t work exactly right, I would do another take, so it could have that feeling of liveness even though it was contained in this digital format,” she says. “What I’m trying to figure out is how to make it a living experience, because that informs my improvisational work.”','00:30','Tracie Morris','3958447584',4.00,'/activities/performances/poem.png',1);
insert into activity values (0,'Museum Setting', 'Peformance','Entrance 1','2021-02-15','2021-02-20','In conjunction with Ally, a performance-as-exhibition at The Fabric Workshop and Museum that reimagines the traditional retrospective, we asked artist Janine Antoni and choreographer Stephen Petronio to discuss the process of preparing audiences for performances in a museum setting. “It’s really about how the institution and the artist ‘open’ to the public…[It’s] not just opening the door; it’s an invitation into an experience,” Petronio says.','02:15','Stephen Petronio','843975847',14.25,'/activities/performances/coreo.png',1);
--Tours
insert into activity values (0,'Guided Tour', 'Tour','Main Entrance','2020-01-01','3000-01-01','Professional art historians are available to provide guided Museum tours of the masterworks of the museum’s collection, the Museum’s architecture, and current exhibitions. Tours can be customized to focus on specific galleries, mediums, or collection areas; tours in foreign languages and tours for families and children are also available.','01:45','John Doe','843975847',15.00,'/activities/tours/guided.png',1);
insert into activity values (0,'Self-guided Tour', 'Tour','Main Entrance','2020-01-01','3000-01-01','Explore exhibition highlights, at your own pace: these self-guided tours are overviews of popular collections at the Museum.We welcome instructors and group leaders to lead their own tours and activities in our galleries. This option has proven particularly popular among university and high school educators. You may use any of the galleries, focusing on just one or visiting all of them, including the special temporary exhibits in the Gallery.','00:00','John Doe','843975847',10.00,'/activities/tours/selfguided.jpg',1);
--Films
insert into activity values (0,'Tarkovski Collection', 'Films','Film Study Center','2020-10-10','2020-10-15','Revive Andréi greatest hits, from Assassins(1958) to Offret(1986). His last film, The Sacrifice (1986) was shot in Sweden with many of Ingmar Bergmans regular collaborators, and won an almost unprecedented four prizes at the Cannes Film Festival.','08:10','Martin Armstrong','452352345',12.00,'/activities/films/tarkovksi1.jpg',1);
insert into activity values (0,'Noir','Films','Film Video Library','2020-11-05','2020-11-25','The questions of what defines film noir, and what sort of category it is, provoke continuing debate. Film noir encompasses a range of plots: the central figure may be a private investigator, a plainclothes policeman, an aging boxer, a hapless grifter, a law-abiding citizen lured into a life of crime, or simply a victim of circumstance. Enjoy a series of selected movies that helped defined cinema noir just as we perceive it today.','10:30','John Satin','8394849394',13.00,'/activities/films/noir1.jpg',1);
insert into activity values (0,'Great Swedish Collection', 'Films','Film Archive Center','2020-12-15','2020-12-18','Watch a series of films by the most aclaimed swedish filmmakers. Swedish cinema is known for including many acclaimed films; during the 20th century the industry was the most prominent of Scandinavia. This is largely due to the popularity and prominence of directors Victor Sjöström and especially Ingmar Bergman; and more recently Roy Andersson, Lasse Hallström and Lukas Moodysson.','12:00','Robert Burst','3123123323',15.00,'/activities/films/swedish1.jpg',1);
insert into activity values (0,'Lars Von Trier Experience', 'Films','Film Study Center','2020-12-20','2020-12-22','Enjoy Von Triers work which is known for its genre and technical innovation, confrontational examination of existential, social, and political issues, and his treatment of subjects such as mercy, sacrifice, and mental health.','5:20','Angelo Battio','1948459375',8.50,'/activities/films/lars1.jpg',1);
insert into activity values (0,'The colors of Krzysztof Kieslowski', 'Films','Film Archive Center','2020-12-20','2020-12-22',' Kieślowski remains one of Europes most influential directors, his works included in the study of film classes at universities throughout the world. The 1993 book Kieślowski on Kieślowski describes his life and work in his own words, based on interviews by Danusia Stok. Come to revisit his most notorious trilogy of colors.','04:30','Clark DeCoco','048349284',7.25,'/activities/films/kieslowski1.jpg',1);
--Exhibitions
insert into activity values (0,'Enlightenment To Revolution', 'Exhibition','Floor 1, Section A','2020-09-24','2021-01-24','Explore the radical force that transformed the religious, cultural and political landscape of India and beyond in this landmark exhibition. A philosophy originating in medieval India, Tantra has been linked to successive waves of revolutionary thought, from its sixth-century transformation of Hinduism and Buddhism, to the Indian fight for independence and the rise of 1960s counterculture.','02:00','Joseph Hotung','183740234',15.00,'/activities/exhibitions/tantra.png',1);
insert into activity values (0,'Culture and Climate ', 'Exhibition','Floor 3, Section C', '2020-10-22','2021-02-21','Home to rich cultures for nearly 30,000 years, the Arctic is far from the inhospitable hinterland its often imagined to be From ancient mammoth ivory sculpture to modern refitted snow mobiles, the objects in this immersive exhibition reveal the creativity and resourcefulness of Indigenous Peoples in the Arctic. Developed in collaboration with Arctic communities, the exhibition celebrates the ingenuity and resilience of Arctic Peoples throughout history. It tells the powerful story of respectful relationships with icy worlds and how Arctic Peoples have harnessed the weather and climate to thrive.','03:30','Martha Snowshoe','128384020',18.00,'/activities/exhibitions/climate.png',1);
insert into activity values (0,'Library of Exile', 'Exhibition','Floor 2, Section A','2020-08-27','2021-01-12','Created as a space to sit and read and be, library of exile is an installation by British artist and writer, Edmund de Waal, housing more than 2,000 books in translation, written by exiled authors. Unveiled to great acclaim during the Venice Biennale 2019, this porcelain-covered pavilion is intended as a place of contemplation and dialogue. It is about exile, says de Waal, what it means to have to move to another country, to speak another language.','01:25','Edmund DeWall','9383747264',00.00,'/activities/exhibitions/exile.png',1);
insert into activity values (0,'The Tomb of the Unknown Craftsman', 'Exhibition','Floor 1, Section B','2020-08-27','2021-02-20','Experience Grayson Perrys playful memorial to the unnamed craftsmen and women who made some of the wonders of history.Created and displayed as part of an exhibition at the British Museum in 2011 and now making its return, The Tomb of the Unknown Craftsman is a sculpture of an iron ship, sailing into the afterlife. The ship is hung with hand-made replicas of British Museum objects, representing crafts made through history – by forgotten men and women – which have survived into the present day.','02:00','Grayson Perry','7384829349',14.50,'/activities/exhibitions/perry.png',1);
insert into activity values (0,'Picasso to Celmins', 'Exhibition','Floor 2, Section B','2020-10-17','2022-02-09','Spanning almost one hundred years of modern art, this exhibition will showcase highlights from the wide-ranging collection of Alexander Walker (1930–2003), longstanding film critic for Londons Evening Standard newspaper and prolific collector of modern and contemporary prints and drawings. In life, Walker surrounded himself with works from his collection in all rooms of his Maida Vale flat including his kitchen and bathroom.','01:00','Richard Hockney','843975847',10.00,'/activities/exhibitions/celmin.png',1);
---------------------------------SCHEDULE--------------------------------
--Performances
insert into schedule values (0,'18:00',50,1,1);
insert into schedule values (0,'20:00',60,1,1);
insert into schedule values (0,'14:00',30,1,2);
insert into schedule values (0,'15:30',30,1,2);
insert into schedule values (0,'10:00',20,1,3);
insert into schedule values (0,'10:30',20,1,3);
insert into schedule values (0,'11:00',35,1,3);
insert into schedule values (0,'11:30',35,1,3);
insert into schedule values (0,'16:00',30,1,4);
insert into schedule values (0,'18:30',30,1,4);
--Tours
insert into schedule values (0,'10:00',15,1,5);
insert into schedule values (0,'12:00',15,1,5);
insert into schedule values (0,'14:00',15,1,5);
insert into schedule values (0,'16:00',15,1,5);
insert into schedule values (0,'18:00',15,1,5);
insert into schedule values (0,'10:00',999,1,6);
--Films
insert into schedule values (0,'12:00',25,1,7);
insert into schedule values (0,'10:00',20,1,8);
insert into schedule values (0,'09:00',35,1,9);
insert into schedule values (0,'14:00',20,1,10);
insert into schedule values (0,'16:30',30,1,11);
--Exhibitions
--All Day?
insert into schedule values (0,'10:00',30,1,12);
insert into schedule values (0,'10:00',30,1,13);
insert into schedule values (0,'10:00',30,1,14);
insert into schedule values (0,'10:00',30,1,15);
insert into schedule values (0,'10:00',30,1,16);
---------------------------------ARTWORKS--------------------------------
--Perf. 1
insert into artwork values (0,'Faith',2017,'Contemporary Dance','A new work choreographed by Kun-Yang Lin will contemplate the relationship between religious practice and contemporary dance. Engaging with practitioners of various religions in story circle encounters, Lin and his company of dancers will consider the role movement plays in religious rituals and actions, and how the artistic process can provide both artists and audience members with a space for exploring religious differences and spiritual commonalities.','/artworks/faith.png',1);
--Perf. 2
insert into artwork values (0,'In the middle, somewhat elevated',1987,'Ballet','In the middle, somewhat elevated, originally commissioned by Rudolf Nureyev in 1987 for the Paris Opera Ballet, is set to a pulsating, electronic soundscape by Thom Willems. The work has since been recognized as a contemporary masterpiece.','/artworks/middle.png',1);
insert into artwork values (0,'In the night',1970,'Ballet','It is a ballet in one act made by New York City Ballet ballet master Jerome Robbins to nocturnes of Frédéric Chopin. The premiere took place on Thursday, January 29, 1970 at the New York State Theater, Lincoln Center, with costumes by Anthony Dowell and lighting by Jennifer Tipton.','/artworks/night.jpg',1);
--Perf. 3
insert into artwork values (0,'Improvisational Work',2019,'Improvisation','Tracie Morris was not present when audiences heard the sound poems she contributed to the Whitney Biennial, but she wanted them to be able to experience the “intimacy of a live event” anyway. Informed by her improvisational background, Morris used a variety of techniques to ensure the recorded work did not feel stiff, in both presentation and production. “If I felt that it didn’t work exactly right, I would do another take, so it could have that feeling of liveness even though it was contained in this digital format".','/artworks/improv1.jpg',1);
--Perf. 4
insert into artwork values (0,'Guggenheim',2016,'Choreography','Stephen Petronio has honed a unique language of movement that speaks to the intuitive and complex possibilities of the body, informed by its shifting cultural context. In the past 30 years, Petronio has created over 35 works for his company, and has been commissioned by some of the most prestigious modern and ballet companies around the world.','/artworks/chor1.png',1);
--Guided Tour

--Unguided Tour