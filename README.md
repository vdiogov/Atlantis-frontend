FRONTEND

1 - Create Frontend docker image:

cd .\frontend\atlantis
docker build . -t atlantis-frontend

2 - create the docker conteiner:
docker run -d -p 80:80 --name atlantis-frontend_app atlantis-frontend

3 - test:

http://localhost:80/