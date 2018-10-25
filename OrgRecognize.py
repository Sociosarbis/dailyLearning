class Orgrecognize:
    def __init__(self, input_sentence):
        self.hidden_states = [chr(cate) for cate in range(ord('A'), 26)]
        self.observed_states = input_sentence
        self.initial_vector = self.load_initial_vector()
        self.transition_matrix = self.load_transition_matrix()
        self.emission_matrix = self.load_emission_matrix()

    def load_patterns(self):
        result = []
        with open('./data/nt.pattern.txt', mode='r') as file:
            datas = file.readlines()
            for line in datas:
                result.append(line.strip())
        return result

    def load_transition_matrix(self):
        result = {x: {} for x in self.hidden_states}
        with open('./data/transition_probability.txt', mode='r') as file:
            datas = file.readlines()
            for line in datas:
                for line in datas:
                    first_state, second_state, prob = line.strip().split(',')
                    result[first_state][second_state] = float(prob)
        return result

    def load_initial_vector(self):
        result = {}
        with open('./data/initial_vector.txt', mode='r') as file:
            datas = file.readlines()
            for line in datas:
                hidden_state, prob = line.strip().split(',')
                result[hidden_state] = prob
        return result

    def load_emission_matrix(self):
        result = {x: {} for x in self.hidden_states}
        with open('./data/emit_probability.txt', mode='r') as file:
            datas = file.readlines()
            for line in datas:
                hidden_state, observed_state, prob = line.strip().split(',')
                result[hidden_state][observed_state] = prob
        return result

    def viterbi(self):
        result = {x: [] for x in self.hidden_states}
        compute_recode = []
        tmp_result = {}
        for state in self.hidden_states:
            if self.emission_matrix[state].has_key(self.observed_states[0]):
                tmp_result[state] = self.initial_vector[state] * \
                    self.emission_matrix[state][self.observed_states[0]]
            else:
                tmp_result[state] = 0
        compute_recode.append(tmp_result)
        for index, word in enumerate(self.observed_states):
            tmp_result = {}
            for current_state in self.hidden_states:
                max_prev_state = None
                if self.emission_matrix[current_state].has_key(word):
                    tmp_result[current_state], max_prev_state = max([(compute_recode[index][prev_state] * self.transition_matrix[prev_state]
                                                                      [current_state] * self.emission_matrix[current_state][word], prev_state) for prev_state in self.hidden_states])
                else:
                    tmp_result[current_state] = 0
                result[current_state].append(max_prev_state)
            compute_recode.append(tmp_result)
        for state in result:
            result[state].append(state)
        final_prob = compute_recode[-1]
        path_max_prob = max(final_prob, key=final_prob.get)
        return path_max_prob

    def get_organization(self, sequence, patterns):
        org_indices = []
        orgs = []
        tag_sequence_str = ''.join(sequence)
        for pattern in patterns:
            if pattern in tag_sequence_str:
                start_index = tag_sequence_str.index(pattern)
                end_index = start_index + len(pattern)
                org_indices.append([start_index, end_index])
        if len(org_indices) != 0:
            for start, end in org_indices:
                orgs.append(''.join(self.observed_states[start:end]))
        return orgs
