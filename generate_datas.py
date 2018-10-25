def generate_initial_vector(hidden_states):
    the_hidden_states = {x: 0 for x in hidden_states}
    count = 0
    with open('./data/nt.txt', mode='r') as nrfile:
        all_data = nrfile.readlines()
        for line in all_data:
            # 为[*(词性,次数)]结构的列表
            tags_and_freq = line.strip().split(' ')[1:]
            # 逐对遍历tags_and_freq列表
            for index in range(0, len(tags_and_freq)):
                tag, freq = tags_and_freq[index:index + 2]
                the_hidden_states[tag] += int(freq)
                count += int(freq)
    # 以出现次数/总次数计算每种隐性状态的初始概率并存储
    with open('./data/initial_vector.txt', mode='w') as outputfile:
        for key, value in the_hidden_states.items():
            str_to_write = '%s,%d,%f\n' % (key, value, float(value) / count)
            outputfile.write(str_to_write)


def generate_transition_probability(hidden_states):
    result = []
    with open('./data/nt.tr.txt', mode='r') as initial_count_file:
        all_data = initial_count_file.readlines()
        for line in all_data[1:]:
            split_line = line.strip().split(',')
            first_state = split_line[0]
            the_sum = sum([int(number) for number in split_line[1:]])
            for index, second_state in enumerate(hidden_states):
                # 行结构[上一状态,下一状态,概率]
                result.append([first_state, second_state, float(
                    split_line[1:][index] / the_sum)])
    with open('./data/transition_probability.txt', mode='w') as output_file:
        for thelist in result:
            str_to_write = '%s,%s,%s\n' % tuple(thelist)
            output_file.write(str_to_write)


def generate_emit_probability(initial_freq):
    result = []
    with open('./data/nt.txt', mode='r') as nrfile:
        all_data = nrfile.readlines()
        for line in all_data:
            split_line = line.strip().split(' ')
            observed_state = split_line[0]
            tags_and_freq = split_line[1:]
            for index in range(0, len(tags_and_freq), 2):
                tag, freq = tags_and_freq[index:index + 2]
                # 返回[隐藏状态,观察状态,转化概率] 转化概率 = 隐藏状态转观察状态的次数 / 隐藏状态的总次数
                result.append(
                    [tag, observed_state, float(freq) / initial_freq[tag]])
    with open('./data/emit_probability.txt', mode='w') as output_file:
        for thelist in result:
            str_to_write = '%s,%s,%s\n' % tuple(thelist)
            output_file.write(str_to_write)


def get_initial_freq():
    result = {}
    with open('./data/initial_vector.txt', mode='r') as file:
        all_data = file.readlines()
        for line in all_data:
            split_line = line.strip().split(',')
            if len(split_line) == 3:
                # 返回词性->次数的dict
                result[split_line[0]] = int(split_line[1])
    return result
