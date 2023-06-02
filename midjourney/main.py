from midjourney_api import MidjourneyApi

if __name__ == '__main__':
    #read  each line  from types.txt and store each line as itemn in list - without \n
    with open('types.txt') as f:   
        types = f.read().splitlines()
    for i in range(len(types)):
        midjourney_api = MidjourneyApi(types[i])
        image_path=midjourney_api.image_path()
